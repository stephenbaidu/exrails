# == Schema Information
#
# Table name: roles
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  permissions :text             default("--- []\n")
#  created_at  :datetime
#  updated_at  :datetime
#
# Indexes
#
#  index_roles_on_name  (name) UNIQUE
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :role do
    name "MyString"
    permissions "MyString"
  end
end
