# 별도 Python 학습 예시: 웹의 실행 버튼은 Java API를 호출합니다.
from fastapi import FastAPI
from pydantic import BaseModel, conint
from fastapi.testclient import TestClient

app = FastAPI()
class QuoteRequest(BaseModel):
    quantity: conint(strict=True, ge=1, le=100)
    unit_price: conint(strict=True, ge=0, le=10000)
class QuoteResponse(BaseModel):
    total: int

@app.post("/quote", response_model=QuoteResponse)
def quote(body: QuoteRequest):
    return {"total": body.quantity * body.unit_price}

with TestClient(app) as client:
    assert client.post("/quote", json={"quantity": 3, "unit_price": 1200}).json() == {"total": 3600}
    assert client.post("/quote", json={"quantity": 0, "unit_price": 1200}).status_code == 422
    assert client.post("/quote", json={"quantity": "3", "unit_price": 1200}).status_code == 422
