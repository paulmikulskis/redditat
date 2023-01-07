"""
This type stub file was generated by pyright.
"""

TWITTER_ERRORS = ...
class UserNotFound(Exception):
    """Exception raised when user isn't found.

    Attributes:
        message -- explanation of the error
    """
    def __init__(self, message) -> None:
        ...
    


class GuestTokenNotFound(Exception):
    """
    Exception Raised when the guest token wasn't found after specific number of retires

    Attributes:
        message -- explanation of the error
    """
    def __init__(self, message) -> None:
        ...
    


class InvalidTweetIdentifier(Exception):
    """
        Exception Raised when the tweet identifier is invalid

        Attributes:
            message -- explanation of the error
    """
    def __init__(self, message) -> None:
        ...
    


class ProxyParseError(Exception):
    """
    Exception Raised when an error occurs while parsing the provided proxy

    Attributes:
        message -- explanation of the error
    """
    def __init__(self, message=...) -> None:
        ...
    


class UserProtected(Exception):
    """
    Exception Raised when an error occurs when the queried User isn't available / Protected

    Attributes:
        message -- explanation of the error
    """
    def __init__(self, message) -> None:
        ...
    


class UnknownError(Exception):
    """
        Exception Raised when an unknown error occurs

        Attributes:
            message -- explanation of the error
        """
    def __init__(self, message) -> None:
        ...
    

