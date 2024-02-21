"""Script for parsing vanguard transaction history into csv format."""

# ##################################--################################## #
#                                 IMPORTS
# ##################################--################################## #

from enum import Enum
from io import StringIO
import os

import pandas as pd


# ##################################--################################## #
#                                 PARAMS
# ##################################--################################## #

_ROOT_DIR = "/Users/mitchell/Documents/investment-dashboard"
_INPUT_FILEPATH = os.path.join(_ROOT_DIR, "test_data/vanguard_raw_2019-01-31_2024-02-13.txt")
_OUTPUT_FILEPATH = os.path.join(_ROOT_DIR, "test_data/vanguard_2019-01-31_2024-02-13.csv")

class Columns(Enum):
  SETTLE_DATE = "Settlement date"
  TRADE_DATE = "Trade date"
  SYMBOL = "Symbol"
  NAME = "Name"
  TRANSACTION_TYPE = "Transaction type"
  QUANTITY = "Quantity"
  PRICE = "Price"
  COMMISSIONS = "Commissions & fees"
  AMOUNT = "Amount"

COLUMN_DEFAULTS = {
  Columns.SETTLE_DATE: "",
  Columns.TRADE_DATE: "",
  Columns.SYMBOL: "",
  Columns.NAME: "",
  Columns.TRANSACTION_TYPE: "",
  Columns.QUANTITY: "0",
  Columns.PRICE: "0",
  Columns.COMMISSIONS: "0",
  Columns.AMOUNT: "0",
}

COLUMN_TYPES = {
  Columns.SETTLE_DATE: str,
  Columns.TRADE_DATE: str,
  Columns.SYMBOL: str,
  Columns.NAME: str,
  Columns.TRANSACTION_TYPE: str,
  Columns.QUANTITY: str,
  Columns.PRICE: str,
  Columns.COMMISSIONS: str,
  Columns.AMOUNT: str,
}



# ##################################--################################## #
#                                 HELPERS
# ##################################--################################## #

def load_raw_file_text(filepath: str) -> str:
  records: list[str] = []
  with open(filepath, "r") as f:
    record_rows = []
    for row, line in enumerate(f.readlines()):
      if row == 0:
        headers = line.strip()
        continue
      if row % 4 == 1 and record_rows:
        records.append("\t".join(record_rows))
        record_rows = []
      else:
        record_rows.append(line.strip())
  raw_text = "\n".join([headers]+records)
  return raw_text


def formatRawTextAsCsvString(raw_text: str) -> str:
  s = raw_text.replace("—", "").replace("$","").replace("Free","")
  return s


def pandasDfFromCsvString(csv_string: str) -> pd.DataFrame:
  csv_io = StringIO(csv_string)
  df = pd.read_csv(csv_io, sep="\t")
  for c in Columns:
    df[c.value].fillna(COLUMN_DEFAULTS[c], inplace=True)
    df[c.value] = df[c.value].astype(COLUMN_TYPES[c])
  return df

def saveDfAsCsvFile(df: pd.DataFrame) -> None:
  with open(_OUTPUT_FILEPATH, "w") as f:
    df.to_csv(f, index=False, header=True)

# ##################################--################################## #
#                                  MAIN
# ##################################--################################## #

def main() -> None:
  raw_text = load_raw_file_text(_INPUT_FILEPATH)
  csv_string = formatRawTextAsCsvString(raw_text)
  df = pandasDfFromCsvString(csv_string)
  saveDfAsCsvFile(df)

if __name__ == "__main__":
  main()