from typing import Any, Dict, Optional

class AppException(Exception):
    """Base application exception"""
    
    def __init__(
        self,
        status_code: int = 500,
        error_type: str = "internal_error",
        message: str = "An unexpected error occurred",
        details: Optional[Dict[str, Any]] = None
    ):
        self.status_code = status_code
        self.error_type = error_type
        self.message = message
        self.details = details or {}
        super().__init__(self.message)

class NotFoundException(AppException):
    """Resource not found exception"""
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            status_code=404,
            error_type="not_found",
            message=f"{resource} with id '{identifier}' not found",
            details={"resource": resource, "identifier": identifier}
        )

class ValidationException(AppException):
    """Validation exception"""
    def __init__(self, message: str, errors: Dict[str, Any]):
        super().__init__(
            status_code=400,
            error_type="validation_error",
            message=message,
            details={"errors": errors}
        )

class DatabaseException(AppException):
    """Database operation exception"""
    def __init__(self, operation: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=500,
            error_type="database_error",
            message=f"Database operation '{operation}' failed",
            details=details
        )