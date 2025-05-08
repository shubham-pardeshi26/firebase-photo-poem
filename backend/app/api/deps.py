
from typing import Generator, Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from backend.app.core import security
from backend.app.core.config import settings
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.token import TokenData
from backend.app.crud import user as crud_user

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/login/access-token" # This will be the path to your token endpoint
)

DBSession = Annotated[Session, Depends(get_db)]
Token = Annotated[str, Depends(reusable_oauth2)]

def get_current_user(
    db: DBSession, token: Token
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenData(email=payload.get("sub"))

    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    if token_data.email is None:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials (no email in token)",
        )

    user = crud_user.get_user_by_email(db, email=token_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    # This is an example of how to add more checks, like superuser status
    # if not current_user.is_active:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

CurrentUser = Annotated[User, Depends(get_current_active_user)]
    