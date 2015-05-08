# == Schema Information
#
# Table name: sample_statuses
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :sample_status do
    name "MyString"
  end

end
