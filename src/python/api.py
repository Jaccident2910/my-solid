from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dataProcessing import convertToDict
from mlTools import interface
class Item(BaseModel):
    #name: str | None = None
    #description: str | None = None
    #price: float| None = None
    #tax: float | None = None
    class Config:
        extra = "allow"


app = FastAPI()

origins = ["http://localhost:3000",]
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],
)

@app.post("/items/")
async def create_item(item: Item):
    print(item)
    print("\n\n\n\n\n")
    convertedDict = convertToDict(item)
    interface(convertedDict)
    return {"result": "Item received. Nice one, mate :)"}
