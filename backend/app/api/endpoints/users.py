
from typing import Any, List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app import schemas
from backend.app import crud
from backend.app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: deps.DBSession,
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create_user(db=db, user=user_in)
    return user


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: deps.CurrentUser,
) -> Any:
    """
    Get current user.
    """
    return current_user
    