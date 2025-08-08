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

def transform_file(df, keep_product_name=False):
  if df is None:
    return None;

  # Settings
  header_old = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ']
  header_new = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
  header_new_final = ["訂單號碼\nSố phiếu giao",	"寄件件數\nSố lượng",	"尺寸\nQuy cách",	"重量\nTrọng lượng",
                      "品名\nTên sản phẩm",	"收件公司\nCông ty nhận hàng",	"收件者姓名\nTên người nhận",
                      "收件地址\nĐịa chỉ nhận hàng",	"收件電話\nSố điện thoại nhận hàng", 
                      "寄件公司\nTên công ty giao hàng", "寄件者姓名\n", "代收貨款\nSố tiền phải thu",
                      "指定配送日期\nNgày giao hàng",  "備註1(銷售訂單編號)\nMã đơn hàng bán", "備註2(識別號)\nMã định danh" ]
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
    # ('J', "大發公司"),
    # ('K', "大發公司"),
  ]
  tien_mat_strings = [
    "Tiền Mặt", "tiền mặt", "tiền Mặt", "Tiền mặt", "Tiềnmặt", "TiềnMặt", "tiềnmặt",
    "Tien Mat", "tien mat", "tien Mat", "Tien mat", "Tienmat", "TienMat", "tienmat",
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
  
  # Money set to 0 if no "Tiền Mặt"
  mask = ~df['O'].apply(lambda x: any(str(x) in item for item in tien_mat_strings))
  df.loc[mask, 'AD'] = 0

  # Move columns
  for pair in move_col_pairs:
    df_new[pair[1]] = df.pop(pair[0])

  # Fill
  for pair in fill_pairs:
    df_new[pair[0]] = pair[1]

  # Split name and phone number
  df_new['G'] = df['AJ'].str.replace(r'(\d.*\d)', '', regex=True).fillna('None')
  df_new['I'] = df['AJ'].str.extract(r'(\d.*\d)').fillna('None')

  # Fill required field
  df_new['H'].fillna('None', inplace=True)
  
  # Turn money to number
  df_new['L'] = df_new['L'].astype(int)

  # Remove duplicated rows
  agg_dict = {col: 'first' for col in df_new.columns if col != 'A'}
  agg_dict.update({
      'E': (lambda x: (', '.join(x.astype(str)) if keep_product_name else '')),
      'L': 'sum',
  })

  df_new = df_new.groupby('A', as_index=False).agg(agg_dict)

  # Remove sum rows
  df_new = df_new.loc[~df_new['A'].isna()]

  # Change new header
  df_new.columns = header_new_final

  return df_new


def export_excel_beautifully(df, filename):
  with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
    df.to_excel(writer, index=False, sheet_name='Sheet1')
          
    workbook = writer.book
    worksheet = writer.sheets['Sheet1']

    # Header format
    wrap_format = workbook.add_format({ 
      'text_wrap': True, 
      'bold': True,
      'border': 2,
      'align': 'center',
    })
    # worksheet.set_row(0, None, wrap_format)
    for col_num, value in enumerate(df.columns.values):
      worksheet.write(0, col_num, value, wrap_format)

    # Autofit width
    for i, col in enumerate(df.columns):
      max_len = max(
          len(str(col)),  # header length
          df[col].astype(str).str.len().max()  # max data length
      )
      worksheet.set_column(i, i, max_len + 2)
    


def main_csv():
  file_path = "../examples/upload.csv"
  new_file_path = "../examples/download.csv"
  df = load_csv(file_path)
  df_new = transform_file(df)
  df_new.to_csv(new_file_path, index=False)

def main_excel():
  file_path = "../examples/upload.xls"
  new_file_path = "../examples/download.xlsx"
  df = pd.read_excel(file_path, dtype=str)# , encoding=charenc)
  df_new = transform_file(df)
  # df_new.to_excel(new_file_path, engine='openpyxl', index=False)
  export_excel_beautifully(df_new, new_file_path)


if __name__ == "__main__":
  main_excel()