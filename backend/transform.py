import pandas as pd
import chardet

def load_csv(file_path):
  try:
    with open(file_path, 'rb') as f:
      result = chardet.detect(f.read())
      charenc = result['encoding']

    df = pd.read_csv(file_path, encoding=charenc)
    return df
  except Exception as e:
    print(f"Error loading CSV file: {e}")
    return None
def move_column(df1, df2, idx_old, idx_new):
  df2[idx_new] = df1.pop(idx_old)

def transform_file(df):
  # Settings
  header_old = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ']
  header_new = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
  header_new_final = ["訂單號碼",	"寄件件數",	"尺寸",	"重量",	"品名",	"收件公司",	"收件者姓名 出貨商",
                    "收件地址",	"收件電話 出貨商", "計件公司", "寄件者姓名", "代收貨款", "指定配送日期",  "備註1", "備註2" ]
  move_col_pairs = [
    ('E', 'A'),
    ('V', 'E'),
    ('I', 'F'),
    ('AJ', 'G'),
    ('J', 'H'),
    ('AD', 'L'),
    ('F', 'M'),
    ('R', 'N'),
    ('AN', 'O')
  ]
  fill_pairs = [
    ('B', '1'),
    ('C', '1'),
    ('D', '1'),
    ('J', "大發公司"),
    ('K', "大發公司"),
  ]

  df_new = pd.DataFrame(columns=header_new)

  if df is not None:
    df.columns = header_old[0:df.columns.size]
    
    # Move columns
    for pair in move_col_pairs:
      move_column(df, df_new, pair[0], pair[1])
      
    # Fill
    for pair in fill_pairs:
      df_new[pair[0]] = pair[1]
    
    # Change new header
    df_new.columns = header_new_final

    # Save the file
  
  return df_new
    


if __name__ == "__main__":
  file_path = "example/upload.csv"
  new_file_path = "example/download.csv"
  df = load_csv(file_path)
  df_new = transform_file(df)
  df_new.to_csv(new_file_path, index=False)
