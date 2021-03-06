# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  permissions :text             default([])
#  status      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_roles_on_name  (name) UNIQUE
#

FactoryGirl.define do
  factory :role do
    name "MyString"
    description "MyText"
    permissions ["MyText"]
    status "MyString"
  end

end
