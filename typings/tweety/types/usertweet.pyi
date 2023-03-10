"""
This type stub file was generated by pyright.
"""

from . import deprecated

class UserTweets(dict):
    def __init__(self, user_id, http, pages=..., get_replies: bool = ..., wait_time=..., cursor=...) -> None:
        ...
    
    def get_next_page(self, user_id, get_replies): # -> list[Unknown] | None:
        ...
    
    def to_xlsx(self, filename=...): # -> Excel:
        ...
    
    def __getitem__(self, index):
        ...
    
    def __iter__(self): # -> Generator[Unknown, None, None]:
        ...
    
    def __len__(self): # -> int:
        ...
    
    def __repr__(self): # -> str:
        ...
    
    @deprecated
    def to_dict(self): # -> list[Unknown]:
        ...
    


