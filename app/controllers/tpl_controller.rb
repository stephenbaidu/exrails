class TplController < ActionController::Base
  include ::BaseInterop
  
  layout false
  
  before_action -> {
    @app   = params[:app]
    @model = params[:model]
    @model.gsub!('-', '_') if @model
    @model = @model.underscore.pluralize if @model
  }

  before_action :render_view, except: [:create, :update]

  def index
    render "layouts/layout_#{@app}" and return if (@app and !@model and layout_exists?)
    render "layouts/layout_tpl_01"  and return if (@app and !@model and !layout_exists?)
  end

  def new
  end

  def show
  end

  def edit
  end

  def _config
    render json: {
      success: true,
      data: {
        formColumns: AppTpl.form_columns(@model),
        gridColumns: AppTpl.grid_columns(@model),
        columns: AppTpl.form_columns(@model),
        lookups: AppTpl.lookups(@model),
        options: AppTpl.options(@model)
      }
    }
  end

  def _columns
    render json: AppTpl.form_columns(@model)
  end

  def _lookups(get = false)
    render json: AppTpl.lookups(@model)
  end

  private
    def _RC
      @model.classify.constantize
    end

    def render_view
      return unless @app and @model && (@action = params[:action])

      # Load search template
      render "tpl/search" and return if (@action == "show" && params[:id] == "search")

      if template_exists? "#{@model}/#{@action}"
        render "#{@model}/#{@action}"
      end
    end

    def layout_exists?
      template_exists? "layouts/layout_#{@app}"
    end
end
