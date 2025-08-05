# 大發送貨單轉換網頁工具

## Run at local
1. clone this repo

### Backend
2. Start venv and install dependencies
```bash
# @backend
python -m venv .venv
.venv/Scripts/activate # activate venv
pip install -r requirements.txt
```

3. Start Flask
```bash
# @backend
flask run dev
```

### Frontend

4. Install dependencies
```bash
# @frontend
npm install
```

5. Edit .env.example
copy `.env.example` as `.env.local` and type in the API address of the backend.


6. Start frontend
```bash
# @fronend
npm run dev
```