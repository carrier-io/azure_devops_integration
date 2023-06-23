from typing import Optional

from pydantic import ValidationError
from pylon.core.tools import log
from pylon.core.tools import web
from tools import rpc_tools

from ..models.integration_pd import SecurityTestModel
from ...integrations.models.pd.integration import SecretField


class RPC:
    integration_name = 'azure_devops'

    @web.rpc(f'dusty_config_{integration_name}')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def make_dusty_config(self, context, test_params, scanner_params):
        """ Prepare dusty config for this scanner """
        log.info("Test params: %s", test_params)
        log.info("Scanner params: %s", scanner_params)
        log.info(f" context: {self.context}")
        integration = self.context.rpc_manager.call.integrations_get_by_id(
            scanner_params.get('project_id'), scanner_params['id']
            )

        # Get secret field (password) from secrets
        secret_field = SecretField.parse_obj(integration.settings["access_token"])
        token = secret_field.unsecret(test_params['project_id'])

        result = {
            "org": integration.settings["organization"],
            "project": integration.settings["project"],
            "pat": token,
            "team": integration.settings.get("team"),
            "issue_type": integration.settings.get("issue_type"),
            "custom_fields": integration.settings.get("custom_fields"),
            "assignee": integration.settings.get("assignee")
        }
        return "azure_devops", result

    @web.rpc(f'security_test_create_integration_validate_{integration_name}')
    @rpc_tools.wrap_exceptions(ValidationError)
    def security_test_create_integration_validate(self, data: dict, pd_kwargs: Optional[dict] = None, **kwargs) -> dict:
        if not pd_kwargs:
            pd_kwargs = {}
        pd_object = SecurityTestModel(**data)
        return pd_object.dict(**pd_kwargs)
