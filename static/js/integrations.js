const AzureDevopsIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'display_name', 'logo_src', 'section_name'],
    emits: ['update'],
    template: `
<div
        :id="modal_id"
        class="modal modal-small fixed-left fade shadow-sm" tabindex="-1" role="dialog"
        @dragover.prevent="modal_style = {'height': '300px', 'border': '2px dashed var(--basic)'}"
        @drop.prevent="modal_style = {'height': '100px', 'border': ''}"
>
    <ModalDialog
            v-model:description="description"
            v-model:is_default="is_default"
            @update="update"
            @create="create"
            :display_name="display_name"
            :id="id"
            :is_default="is_default"
    >
        <template #body>
            <div class="form-group">
                <h9>Organization</h9>
                <input type="text" v-model="organization" class="form-control form-control-alternative"
                       placeholder=""
                       :class="{ 'is-invalid': error.organization }">
                <div class="invalid-feedback">[[ error.organization ]]</div>

                <h9>Project</h9>
                <input type="text" class="form-control form-control-alternative" placeholder=""
                       v-model="project"
                       :class="{ 'is-invalid': error.project }"
                >
                <div class="invalid-feedback">[[ error.project ]]</div>
                   
                <h9>Personal access token</h9>
                <SecretFieldInput
                    v-model="access_token"
                    placeholder="placeholder for field"
                    :class="{ 'is-invalid': error.access_token }"
                    />
                <div class="invalid-feedback">[[ error.access_token ]]</div>

                <h9>
                    Team
                    <h13>(optional)</h13> 
                </h9>
              
                <input type="text" class="form-control form-control-alternative"
                       placeholder=""
                       :class="{ 'is-invalid': error.team }">
                <div class="invalid-feedback">[[ error.team ]]</div>

   
                <h9>
                    Issue type
                    <h13>(optional)</h13>
                </h9>
                <input type="text" class="form-control form-control-alternative"
                       v-model="issue_type"
                       placeholder=""
                       :class="{ 'is-invalid': error.assignee }">
                <div class="invalid-feedback">[[ error.assignee ]]</div>
                
                <h9>
                    Assignee
                    <h13>(optional)</h13>
                </h9>
                    <input type="text" class="form-control form-control-alternative"
                       v-model="assignee"
                       placeholder=""
                       :class="{ 'is-invalid': error.issue_type }">
                <div class="invalid-feedback">[[ error.issue_type ]]</div>
             
             <h9>
                Custom fields
                <h13>(optional)</h13>
                </h9>
                    <input type="text" class="form-control form-control-alternative"
                       v-model="custom_fields"
                       placeholder=""
                       :class="{ 'is-invalid': error.custom_fields }">
                <div class="invalid-feedback">[[ error.custom_fields ]]</div>
            </div>
            
        </template>
        <template #footer>
            <test-connection-button
                    :apiPath="api_base + 'check_settings/' + pluginName"
                    :error="error.check_connection"
                    :body_data="body_data"
                    v-model:is_fetching="is_fetching"
                    @handleError="handleError"
            >
            </test-connection-button>
        </template>

    </ModalDialog>
</div>
    `,
    data() {
        return this.initialState()
    },
    mounted() {
        this.modal.on('hidden.bs.modal', e => {
            this.clear()
        })
    },
    computed: {
        apiPath() {
            return this.api_base + 'integration/'
        },
        project_id() {
            return getSelectedProjectId()
        },
        body_data() {
            const {
                organization,
                project,
                access_token,
                team,
                issue_type,
                assignee,
                custom_fields,
                description,
                is_default,
                project_id,
                status
            } = this
            return {organization, project, access_token, team, issue_type, assignee, custom_fields, description, is_default, project_id, status}
        },

        modal() {
            return $(this.$el)
        },
        modal_id() {
            return `${this.instance_name}_integration`
        }
    },
    methods: {
        clear() {
            Object.assign(this.$data, this.initialState())
        },
        load(stateData) {
            Object.assign(this.$data, stateData,{
                template: ''
            })
        },
        handleEdit(data) {
            const {description, is_default, id, settings} = data
            this.load({...settings, description, is_default, id})
            this.modal.modal('show')
        },
        handleDelete(id) {
            this.load({id})
            this.delete()
        },
        create() {
            this.is_fetching = true
            fetch(this.apiPath + this.pluginName, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                this.is_fetching = false
                if (response.ok) {
                    this.modal.modal('hide')
                    this.$emit('update', {...this.$data, section_name: this.section_name})
                } else {
                    this.handleError(response)
                }
            })
        },
        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertMain.add(e, 'danger-overlay')
            }
        },
        update() {
            this.is_fetching = true
            fetch(this.apiPath + this.id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.body_data)
            }).then(response => {
                this.is_fetching = false
                console.log(response)
                if (response.ok) {
                    this.modal.modal('hide')
                    this.$emit('update', {...this.$data, section_name: this.section_name})
                } else {
                    this.handleError(response)
                }
            })
        },
        delete() {
            this.is_fetching = true
            fetch(this.apiPath + this.id, {
                method: 'DELETE',
            }).then(response => {
                this.is_fetching = false

                if (response.ok) {
                    this.$emit('update', {...this.$data, section_name: this.section_name})

                } else {
                    this.handleError(response)
                    alertMain.add(`
                        Deletion error. 
                        <button class="btn btn-primary" 
                            onclick="vueVm.registered_components.${this.instance_name}.modal.modal('show')"
                        >
                            Open modal
                        <button>
                    `)
                }
            })
        },

        initialState: () => ({
            modal_style: {'height': '100px', 'border': ''},
            organization: '',
            project: '',
            access_token: '',
            template: '',
            team: null,
            issue_type: null,
            assignee: '',
            custom_fields: '',
            description: '',
            is_default: false,
            is_fetching: false,
            error: {},
            id: null,
            pluginName: 'azure_devops',

            api_base: '/api/v1/integrations/',
            status: integration_status.success,
        })
    }
}

register_component('AzureDevopsIntegration', AzureDevopsIntegration)
