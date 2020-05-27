import argparse
import numpy as np
import pandas as pd
import json

from datetime import datetime


def us_data(source_file):
    df = pd.read_csv(source_file)
    df.columns = [datetime.strptime(c, "%m/%d/%y").date() if i > 11 else c
                  for i, c in enumerate(df.columns)]
    dates = df.columns.values.tolist()[-30:]
    pv = pd.pivot_table(df, values=dates, index="Province_State",
                        columns=[], aggfunc=np.sum).transpose()
    as_dct = pv.to_dict(orient='series')

#    serializable_dict = {
#        state: {"dts": [dt.isoformat() for dt in as_dct[state].index],
#                "values": as_dct[state].tolist()}
#        for state in as_dct
#    }
    return as_dct, pv.index.tolist()


def aggregate_north_america(us_cases, us_deaths, canada_cases, canada_deaths,
                            dates):
    # TODO assertion to make sure we have the same dates everywhere
    # TODO combine us and canada
    aggregate = {
        "dates": [dt.isoformat() for dt in dates],
        "cases": {state: us_cases[state].astype(int).tolist()
                  for state in us_cases},
        "deaths": {state: us_deaths[state].tolist() for state in us_cases}
    }
    return aggregate


def main(us_cases_file, us_deaths_file, world_cases_file, world_deaths_file,
         na_outfile, eu_outfile):
    us_cases, dts1 = us_data(us_cases_file)
    us_deaths, dts2 = us_data(us_deaths_file)
    assert dts1 == dts2
    north_america = aggregate_north_america(us_cases, us_deaths, None, None,
                                            dts1)
    with open(na_outfile, "w") as f:
        json.dump(north_america, f)


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
        "na_outfile",
        help="Name of output file for North-American data"
    )
    parser.add_argument(
        "eu_outfile",
        help="Name of output file for European data"
    )
    args = parser.parse_args()
    main(args.source_us_cases, args.source_us_deaths, args.source_world_cases,
         args.source_world_deaths, args.na_outfile, args.eu_outfile)
