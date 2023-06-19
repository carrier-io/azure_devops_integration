const AzureDevops = {
    props: ['', 'index'],
    emits: ['remove'],
    delimiters: ['[[', ']]'],
    template: `
        <li class="list-group-item d-inline-flex justify-content-between p-1">
            <h13>[[ k ]]</h13>
            <button
                type="button"
                class="btn btn-action btn-24"
                title="remove"
                @click.prevent="remove"
            >
                <i class="fa fa-times"></i>
            </button>
        </li>
    `
}

const AzureDevopsToggle = {
    delimiters: ['[[', ']]'],
    components: {
        AzureDevops
    },
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    watch: {
        integration_data(newState, oldState) {
            this.organization = newState.settings.organization
            this.project = newState.settings.project
            this.team = newState.settings.team
            this.issue_type = newState.settings.issue_type
            this.assignee = newState.settings.assignee
            this.access_token = newState.settings.access_token
        }
    },
    computed: {
        is_local() {
            return !!(this.integration_data.project_id)
        },
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                const {selected_integration: id, is_local, organization, project, team, issue_type, assignee, access_token} = this
                return {id, is_local, organization, project, team, issue_type, assignee, access_token}
            }
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },
        set_data(data) {
            const {id, is_local, organization, project, team, issue_type, assignee, access_token} = data
            this.organization = organization
            this.project = project
            this.team = team
            this.issue_type = issue_type
            this.assignee = assignee
            this.access_token = access_token
            this.$emit('set_data', {id, is_local})
        },

        initialState: () => ({
            organization: '',
            project: '',
            access_token: '',
            team: null,
            issue_type: null,
            assignee: '',
            errors: [],
            warnings: [],
        })
    },
    template: `
<div class="form-group">
    <h9>Organization</h9>
    <input type="text" v-model="organization" class="form-control form-control-alternative"
       placeholder=""
       >
    <h9>Project</h9>
    <input type="text" v-model="project" class="form-control form-control-alternative"
       placeholder=""
       >
    <h9>
       Team
       <h13>(optional)</h13>
    </h9>
    <input type="text" class="form-control form-control-alternative"
       placeholder=""
       v-model="team"
       >
    <h9>
       Issue type
       <h13>(optional)</h13>
    </h9>
    <input type="text" class="form-control form-control-alternative"
       v-model="issue_type"
       placeholder=""
       >
    <h9>
       Assignee
       <h13>(optional)</h13>
    </h9>
    <input type="text" class="form-control form-control-alternative"
       v-model="assignee"
       placeholder=""
       >
 </div>
 `
}

register_component('azure-devops-toggle', AzureDevopsToggle)
