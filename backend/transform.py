from unittest import result
import pandas as pd
import chardet

MIN_COL = 40

def load_csv(file_path):
  # Not used in "transform_file"
  try:
    with open(file_path, 'rb') as f:
      result = chardet.detect(f.read())
      charenc = result['encoding']

    df = pd.read_csv(file_path, encoding=charenc)
    return df
  except Exception as e:
    print(f"Error loading CSV file: {e}")
    return None

def transform_file(df):
  if df is None:
    return None;

  # Settings
  header_old = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ']
  header_new = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
  header_new_final = ["訂單號碼",	"寄件件數",	"尺寸",	"重量",	"品名",	"收件公司",	"收件者姓名",
                    "收件地址",	"收件電話", "寄件公司", "寄件者姓名", "代收貨款", "指定配送日期",  "備註1(銷售訂單編號)", "備註2(識別號)" ]
  move_col_pairs = [
    ('E', 'A'),
    ('V', 'E'),
    ('I', 'F'),
    # ('AJ', 'G'),
    ('J', 'H'),
    # ('AJ', 'I'),
    ('AD', 'L'),
    ('F', 'M'),
    ('R', 'N'),
    ('AN', 'O')
  ]
  fill_pairs = [
    ('B', 1),
    ('C', 1),
    ('D', 1),
    ('J', "大發公司"),
    ('K', "大發公司"),
  ]

  df_new = pd.DataFrame(columns=header_new)

  # Change header name
  if df.columns.size <= len(header_old):
    df.columns = header_old[0:df.columns.size]

    if df.columns.size < MIN_COL: 
      for i in range(df.columns.size+1, MIN_COL):
        df[header_old[i]] = ''

  else:
    df.columns = [
        header_old[idx] if idx < len(header_old) else f'col_{idx}'
        for idx, _ in enumerate(df.columns)
    ]
  
  # Move columns
  for pair in move_col_pairs:
    df_new[pair[1]] = df.pop(pair[0])

  # Split name and phone number
  df_new['G'] = df['AJ'].str.replace(r'(\d.*\d)', '', regex=True)
  df_new['I'] = df['AJ'].str.extract(r'(\d.*\d)')
  
  # Turn money to number
  df_new['L'] = df_new['L'].astype(int)
    
  # Fill
  for pair in fill_pairs:
    df_new[pair[0]] = pair[1]
  
  # Change new header
  df_new.columns = header_new_final

  return df_new
    


def main_csv():
  file_path = "../examples/upload.csv"
  new_file_path = "../examples/download.csv"
  df = load_csv(file_path)
  df_new = transform_file(df)
  df_new.to_csv(new_file_path, index=False)

def main_excel():
  file_path = "../examples/upload.xls"
  new_file_path = "../examples/download.xls"
  df = pd.read_excel(file_path, dtype=str)# , encoding=charenc)
  df_new = transform_file(df)
  df_new.to_excel(new_file_path, engine='openpyxl', index=False)


if __name__ == "__main__":
  main_excel()