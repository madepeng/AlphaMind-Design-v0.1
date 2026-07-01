class ApplicationException(Exception):
    status_code = 400

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class BusinessException(ApplicationException):
    pass


class ValidationException(ApplicationException):
    pass


class NotFoundException(ApplicationException):
    status_code = 404


class ExternalAPIException(ApplicationException):
    status_code = 500


class ConfigurationException(ApplicationException):
    pass
