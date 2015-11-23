class DashboardController < ApplicationController
  include Pundit

  before_action :authorize_data

  def admin
    data = {}
    data[:labels] = ["January", "February", "March", "April", "May", "June", "July"];
    data[:series] = ['Series A', 'Series B'];
    data[:data] = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]

    render json: data
  end

  def main
    data = {}
    data[:labels] = ["January", "February", "March", "April", "May", "June", "July"];
    data[:series] = ['Series A', 'Series B'];
    data[:data] = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]
    
    data[:labels2] = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales"];
    data[:data2] = [300, 100, 40, 120];

    render json: data
  end

  private
    def authorize_data
      true
    end
end
