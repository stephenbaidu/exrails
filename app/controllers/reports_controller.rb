class ReportsController < ApplicationController
  layout false
  
  before_action -> { 
    @report = params[:report].gsub('-', '_')
    # @id = params[:id].present? ? params[:id].gsub('-', '_') : nil
  }

  def index
    @report_title = _tpl_class.title(@report)
    @has_permission = true
    if !has_permission?(@report)
      @has_permission = false
      @error_message = "Sorry, you do not have access to this report."
      report_layout and return
    end
    respond_to do |format|
      format.pdf { report_pdf }
      format.all { report_layout }
    end
  end

  private
    def report_layout
      if File.exists? File.join(_directory, 'layouts', "#{@report}.html.erb")
        render File.join(_directory, 'layouts', "#{@report}")
      else
        @filters = _tpl_class.filters(@report)
        render 'reports/layouts/report'
      end
    end

    def report_pdf
      _tpl_class.set_report_data(self, @report, params[:filter].to_s)
      render _tpl_class.pdf_options(_directory, @report, {show_as_html: params[:debug].present?})
    rescue Exception => e
      BaseInterop.log(e, 'Exception')
      @error_message = 'Missing filters. Please provide required filters.'
      render _tpl_class.pdf_options('', '', {show_as_html: true})
    end

    def _tpl_class
      ReportTpl
    end

    def _directory
      Rails.root.join('app', 'views', 'reports').to_s
    end

    def has_permission?(report)
      permission = "Report:#{report.classify}"
      current_user.admin? or current_user.has_permission?(permission)
    end
end
