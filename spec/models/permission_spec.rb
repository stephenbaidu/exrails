# == Schema Information
#
# Table name: permissions
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_permissions_on_name  (name) UNIQUE
#

require 'spec_helper'

describe Permission do
  pending "add some examples to (or delete) #{__FILE__}"
end
