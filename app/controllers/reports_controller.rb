class ReportsController < ApplicationController
  layout false
  
  before_action -> { 
    @report = params[:report].gsub('-', '_')
    @id = params[:id].present? ? params[:id].gsub('-', '_') : nil
  }

  def index
    @report_title = ReportTpl.title(@report)
    if !has_permission?(@report)
      @message = "Sorry, you do not have access to this report."
      render 'reports/partials/_error.pdf' and return
    end
    respond_to do |format|
      format.pdf { report_pdf }
      format.all { report_layout }
    end
  end

  def report_layout
    if File.exists? Rails.root.join('app', 'views', 'reports', 'layouts', "#{@report}.html.erb")
      render "reports/layouts/#{@report}"
    else
      @filters = ReportTpl.filters(@report)
      render 'reports/layouts/report'
    end
  end

  def report_pdf
    @filter = {}
    params[:filter].split(',').map {|e| e.split(':')}.each {|e| @filter[e[0].to_sym] = e[1] }
    render ReportTpl.pdf_options(@report, {show_as_html: params[:debug].present?})
  end

  def has_permission?(report)
    permission = "Report:#{report.classify}"
    current_user.admin? or current_user.has_permission?(permission)
  end
end
