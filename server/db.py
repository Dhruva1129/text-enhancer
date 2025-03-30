from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/text_enhancer"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class TextHistory(Base):
    __tablename__ = "text_history"
    id = Column(Integer, primary_key=True, index=True)
    input_text = Column(String)
    enhanced_text = Column(String)
    tone = Column(String)

Base.metadata.create_all(engine)
