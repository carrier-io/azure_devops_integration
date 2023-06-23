from typing import Optional, Union

from pydantic import BaseModel
from pylon.core.tools import log

from ...integrations.models.pd.integration import SecretField


class IntegrationModel(BaseModel):
    organization: str
    project: str
    access_token: Union[SecretField, str]
    template: str
    team: None
    issue_type: None
    assignee: str
    custom_fields: str
    description: str
    template: Optional[str]

    def check_connection(self) -> bool:
        import requests
        try:
            url = f'https://dev.azure.com/{self.organization}/_apis/teams?api-version=6.1-preview.3'
            res = requests.get(url, auth=("", self.access_token.value), headers={'content-type': 'application/json'})
            if res.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            log.exception(e)
            return False


class SecurityTestModel(BaseModel):
    id: int
    organization: str
    project: str
    access_token: Union[SecretField, str]
    team: None
    issue_type: None
    assignee: str
    is_local: bool
    project_id: Optional[int]


class PerformanceBackendTestModel(SecurityTestModel):
    ...


class PerformanceUiTestModel(PerformanceBackendTestModel):
    ...
