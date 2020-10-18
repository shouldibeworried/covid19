import argparse
import numpy as np
import pandas as pd
import json

from datetime import datetime

SERIES_LENGTH = 127 
EUROPE = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
          "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
          "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein",
          "Lithuania", "Luxembourg", "Malta", "Netherlands", "Norway", "Poland",
          "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
          "Switzerland", "United Kingdom", "Russia", "Moldova", "Ukraine",
          "Belarus", "Serbia", "North Macedonia", "Montenegro", "Kosovo",
          "Bosnia and Herzegovina", "Albania"]
US = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
      "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
      "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming"] 
CANADA = ["Alberta", "British Columbia", "Manitoba", "New Brunswick",
          "Newfoundland and Labrador", "Nova Scotia", "Ontario",
          "Prince Edward Island", "Quebec", "Saskatchewan"]

def us_data(source_file):
    df = pd.read_csv(source_file)
    df.columns = [datetime.strptime(c, "%m/%d/%y").date() if i > 11 else c
                  for i, c in enumerate(df.columns)]
    df = df[df["Province_State"].isin(US)]
    dates = df.columns.values.tolist()[-SERIES_LENGTH:]
    pv = pd.pivot_table(df, values=dates, index="Province_State",
                        columns=[], aggfunc=np.sum).transpose()
    as_dct = pv.to_dict(orient='series')

    return as_dct, pv.index.tolist()


def canada_data(source_file):
    df = pd.read_csv(source_file)
    df.columns = [datetime.strptime(c, "%m/%d/%y").date() if i > 3 else c
                  for i, c in enumerate(df.columns)]
    df = df[df["Province/State"].isin(CANADA)]
    df = df[df["Country/Region"] == "Canada"]
    dates = df.columns.values.tolist()[-SERIES_LENGTH:]
    df = df[["Province/State"] + dates].set_index("Province/State").transpose()
    as_dct = df.to_dict(orient='series')
    return as_dct, df.index.tolist()


def de_data(source_file):
    df = pd.read_csv(source_file, parse_dates=["Meldedatum"])
    pv = pd.pivot_table(df, values="AnzahlFall",
                        index=["Meldedatum"],
                        columns=["Landkreis"], aggfunc=np.sum, fill_value=0)
    as_dct = pv.to_dict(orient='series')

    return as_dct, pv.index.tolist()


def eu_data(source_file):
    df = pd.read_csv(source_file)
    df.columns = [datetime.strptime(c, "%m/%d/%y").date() if i > 3 else c
                  for i, c in enumerate(df.columns)]

    df = df[df["Country/Region"].isin(EUROPE)]
    df = df[df["Province/State"].isnull()]
    dates = df.columns.values.tolist()[-SERIES_LENGTH:]
    df = df[["Country/Region"] + dates].set_index("Country/Region").transpose()
    as_dct = df.to_dict(orient='series')
    return as_dct, df.index.tolist()


def output_format(cases, deaths, dates):
    aggregate = {
        "dates": [dt.isoformat() for dt in dates],
        "cases": {state: cases[state].astype(int).tolist() for state in cases},
        "deaths": {state: deaths[state].tolist() for state in cases}
    }
    return aggregate


def output_format_de(cases, dates):
    def subtotals(cases):
        return [sum(cases[:i]) for i in range(len(cases))]

    aggregate = {
        "dates": [dt.date().isoformat() for dt in dates],
        "cases": {state: subtotals(cases[state].astype(int).tolist()) for state in cases},
        "deaths": {state: [] for state in cases}
    }
    return aggregate


def main(us_cases_file, us_deaths_file, world_cases_file, world_deaths_file,
         de_cases_file, na_outfile, eu_outfile, de_outfile):
    us_cases, dts1 = us_data(us_cases_file)
    us_deaths, dts2 = us_data(us_deaths_file)
    canada_cases, dts3 = canada_data(world_cases_file)
    canada_deaths, dts4 = canada_data(world_deaths_file)
    assert dts1 == dts2 == dts3 == dts4
    us_cases.update(canada_cases)
    us_deaths.update(canada_deaths)
    north_america = output_format(us_cases, us_deaths, dts1)
    with open(na_outfile, "w") as f:
        json.dump(north_america, f)

    eu_cases, dts1 = eu_data(world_cases_file)
    eu_deaths, dts2 = eu_data(world_deaths_file)
    europe = output_format(eu_cases, eu_deaths, dts1)
    with open(eu_outfile, "w") as f:
        json.dump(europe, f)

    de_cases, dts = de_data(de_cases_file)
    de = output_format_de(de_cases, dts)
    with open(de_outfile, "w") as f:
        json.dump(de, f)
    


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "source_us_cases",
        help="Johns Hopkins raw csv source for US cases timeseries"
    )
    parser.add_argument(
        "source_us_deaths",
        help="Johns Hopkins raw csv source for US deaths timeseries"
    )
    parser.add_argument(
        "source_world_cases",
        help="Johns Hopkins raw csv source for world cases timeseries"
    )
    parser.add_argument(
        "source_world_deaths",
        help="Johns Hopkins raw csv source for world deaths timeseries"
    )
    parser.add_argument(
        "source_de_cases",
        help="RKI raw source file for German cases"
    )
    parser.add_argument(
        "na_outfile",
        help="Name of output file for North-American data"
    )
    parser.add_argument(
        "eu_outfile",
        help="Name of output file for European data"
    )
    parser.add_argument(
        "de_outfile",
        help="Name of output file for German data"
    )
    args = parser.parse_args()
    main(args.source_us_cases, args.source_us_deaths, args.source_world_cases,
         args.source_world_deaths, args.source_de_cases, args.na_outfile,
         args.eu_outfile, args.de_outfile)
