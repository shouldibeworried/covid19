import argparse
import numpy as np
import pandas as pd

from datetime import datetime


def us_data(source_file):
    df = pd.read_csv(source_file)
    df.columns = [datetime.strptime(c, "%m/%d/%y").date() if i > 11 else c
                  for i, c in enumerate(df.columns)]
    dates = df.columns.values.tolist()[-30:]
    pv = pd.pivot_table(df, values=dates, index="Province_State",
                        columns=[], aggfunc=np.sum)
    as_dct = pv.transpose().to_dict(orient='series')

    return {state: {"dts": as_dct[state].index.tolist(),
                    "values": as_dct[state].tolist()}
            for state in as_dct}


def main(us_case_file, us_deaths_file, world_cases_file, world_deaths_file):
    us_cases = us_data(us_case_file)
    import pdb; pdb.set_trace()


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
    args = parser.parse_args()
    main(args.source_us_cases, args.source_us_deaths, args.source_world_cases,
         args.source_world_deaths)
