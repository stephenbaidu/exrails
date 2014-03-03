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

require 'spec_helper'

describe Role do
  pending "add some examples to (or delete) #{__FILE__}"
end
