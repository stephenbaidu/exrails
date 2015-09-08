class ReportsController < ApplicationController

  before_action :authorize_report

  def user_info
    data = User.find(params[:user_id])
    class << data
      attr_accessor :title
    end
    data.title = 'USER DETAILS'

    rpt = ReportBuilder.new('user', data)
    respond_to do |format|
      format.html { render html: rpt.as_html }
      format.csv {
        send_data rpt.as_csv, :filename => "file.csv",
          :type => "test/csv", :disposition  => "attachment"
      }
      format.pdf {
        send_data rpt.as_pdf_base64, :filename => "file.pdf",
          :type => "application/pdf", :disposition  => "attachment"
      }
    end
  end

  def users
    data = {}
    class << data
      attr_accessor :title, :users
    end
    data.title = 'Users'
    data.users = User.all

    rpt = ReportBuilder.new('users', data)
    respond_to do |format|
      format.html { render html: rpt.as_html }
      format.csv {
        send_data rpt.as_csv, :filename => "file.csv",
          :type => "test/csv", :disposition  => "attachment"
      }
      format.pdf {
        send_data rpt.as_pdf_base64, :filename => "file.pdf",
          :type => "application/pdf", :disposition  => "attachment"
      }
    end
  end

  def roles
    data = {}
    class << data
      attr_accessor :title, :roles
    end
    data.title = 'List Of Roles'
    data.roles = Role.all

    rpt = ReportBuilder.new('roles', data)
    respond_to do |format|
      format.html { render html: rpt.as_html }
      format.csv {
        send_data rpt.as_csv, :filename => "file.csv",
          :type => "test/csv", :disposition  => "attachment"
      }
      format.pdf {
        send_data rpt.as_pdf_base64, :filename => "file.pdf",
          :type => "application/pdf", :disposition  => "attachment"
      }
    end
  end

  private
    def authorize_report
      true
    end
end
