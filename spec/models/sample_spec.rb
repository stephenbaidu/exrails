# == Schema Information
#
# Table name: samples
#
#  id               :integer          not null, primary key
#  name             :string
#  description      :string
#  sample_date      :date
#  sample_status_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_samples_on_sample_status_id  (sample_status_id)
#

require 'rails_helper'

RSpec.describe Sample, :type => :model do
  pending "add some examples to (or delete) #{__FILE__}"
end