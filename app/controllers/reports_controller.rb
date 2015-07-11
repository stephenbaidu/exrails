class ReportsController < ApplicationController

  def samples
    data = {}
    class << data
      attr_accessor :title, :samples
    end
    data.title = 'Samples'
    data.samples = Sample.all
    rpt = PDFBuilder.new('samples', data)
    send_data rpt.as_base64, :filename => "pdf.pdf",
                :type => "application/pdf",
                :disposition  => "attachment"
  end

  def sample
    data = Sample.find(params[:sample_id])
    class << data
      attr_accessor :title
    end
    data.title = 'Sample'
    rpt = PDFBuilder.new('sample', data)
    send_data rpt.as_base64, :filename => "pdf.pdf",
                :type => "application/pdf",
                :disposition  => "attachment"
  end
end
