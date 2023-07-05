import logging
from typing import Optional

from pydantic import ValidationError
from pylon.core.tools import web
from tools import rpc_tools

from ..models.integration_pd import PerformanceBackendTestModel, PerformanceUiTestModel


class RPC:
    integration_name = 'azure_devops_integration'

    @web.rpc(f'backend_performance_test_create_integration_validate_{integration_name}')
    @rpc_tools.wrap_exceptions(ValidationError)
    def backend_performance_test_create_integration_validate(self, data: dict,  
            pd_kwargs: Optional[dict] = None, **kwargs) -> dict:
        if not pd_kwargs:
            pd_kwargs = {}
        pd_object = PerformanceBackendTestModel(**data)
        return pd_object.dict(**pd_kwargs)

    @web.rpc(f'backend_performance_execution_json_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def backend_make_execution_json_config(self, integration_data: dict) -> dict:
        """ Prepare execution_json for this integration """
        integration_id = integration_data.get('id')
        project_id = integration_data.get('project_id')
        integration = self.context.rpc_manager.call.integrations_get_by_id(project_id, integration_id)
        performance_settings = integration_data
        integration_settings = integration.settings

        azure_devops_config = {
          'org': performance_settings['organization'],
          'project': performance_settings['project'],
          'pat': integration_settings['access_token']["value"],
          'team': performance_settings['team'],
          'issue_type': performance_settings['issue_type'],
          'assignee': performance_settings['assignee'],
        }

        return azure_devops_config

    @web.rpc(f'ui_performance_test_create_integration_validate_{integration_name}')
    @rpc_tools.wrap_exceptions(ValidationError)
    def ui_performance_test_create_integration_validate(self, data: dict, 
            pd_kwargs: Optional[dict] = None, **kwargs) -> dict:
        if not pd_kwargs:
            pd_kwargs = {}
        pd_object = PerformanceUiTestModel(**data)
        return pd_object.dict(**pd_kwargs)

    @web.rpc(f'ui_performance_execution_json_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def ui_make_execution_json_config(self, integration_data: dict) -> dict:
        """ Prepare execution_json for this integration """
        integration_id = integration_data.get('id')
        project_id = integration_data.get('project_id')
        integration = self.context.rpc_manager.call.integrations_get_by_id(project_id, integration_id)
        performance_settings = integration_data
        integration_settings = integration.settings

        azure_devops_config = {
          'org': performance_settings['organization'],
          'project': performance_settings['project'],
          'pat': integration_settings['access_token']["value"],
          'team': performance_settings['team'],
          'issue_type': performance_settings['issue_type'],
          'assignee': performance_settings['assignee'],
        }

        return azure_devops_config
