import logging
from typing import Optional
from pylon.core.tools import log
from pylon.core.tools import web
from pydantic import parse_obj_as, ValidationError

from ..models.integration_pd import PerformanceBackendTestModel, PerformanceUiTestModel

from tools import rpc_tools, secrets_tools


class RPC:
    integration_name = 'azure_devops'

    @web.rpc(f'backend_performance_test_create_integration_validate_{integration_name}')
    @rpc_tools.wrap_exceptions(ValidationError)
    def backend_performance_test_create_integration_validate(self, data: dict, pd_kwargs: Optional[dict] = None, **kwargs) -> dict:
        if not pd_kwargs:
            pd_kwargs = {}
        pd_object = PerformanceBackendTestModel(**data)
        return pd_object.dict(**pd_kwargs)

    @web.rpc(f'backend_performance_execution_json_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def backend_make_execution_json_config(self, integration_data: dict) -> dict:
        """ Prepare execution_json for this integration """
        integration_id = integration_data.get('id')
        integration = self.context.rpc_manager.call.integrations_get_by_id(integration_id)
        performance_settings = integration_data
        integration_settings = integration.settings
        logging.info(integration_settings['access_token']["value"])

        azure_devops_config = {
          'org': performance_settings['organization'],
          'project': performance_settings['project'],
          'pat': integration_settings['access_token']["value"],
          'team': performance_settings['team'],
          'issue_type': performance_settings['issue_type'],
          # 'custom_fields': integration_settings['custom_fields'],  # doesn't exist in performance settings.
          'assignee': performance_settings['assignee'],
        }
        log.info("azure_config: %s", azure_devops_config)

        return azure_devops_config


    @web.rpc(f'ui_performance_test_create_integration_validate_{integration_name}')
    @rpc_tools.wrap_exceptions(ValidationError)
    def ui_performance_test_create_integration_validate(self, data: dict, pd_kwargs: Optional[dict] = None,
                                                             **kwargs) -> dict:
        if not pd_kwargs:
            pd_kwargs = {}
        pd_object = PerformanceUiTestModel(**data)
        return pd_object.dict(**pd_kwargs)

    @web.rpc(f'ui_performance_execution_json_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def ui_make_execution_json_config(self, integration_id: int) -> dict:
        """ Prepare execution_json for this integration """
        integration = self.context.rpc_manager.call.integrations_get_by_id(integration_id)
        return {'integration_settings': integration.settings, 'task_id': integration.task_id}
