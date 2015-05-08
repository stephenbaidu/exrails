# == Schema Information
#
# Table name: sample_statuses
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SampleStatus < ActiveRecord::Base
  resourcify
end
