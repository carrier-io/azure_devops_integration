import json
from typing import Optional

from pylon.core.tools import log
from pylon.core.tools import web

from tools import rpc_tools, secrets_tools


class RPC:
    integration_name = 'azure_devops'

    @web.rpc(f'{integration_name}_created_or_updated')
    @rpc_tools.wrap_exceptions(RuntimeError)
    def handle_create_task(self, integration_data: dict) -> Optional[str]:
        # project = self.context.rpc_manager.call.project_get_or_404(project_id=integration_data["project_id"])

        return None
