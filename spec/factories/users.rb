# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  provider               :string           not null
#  uid                    :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string
#  last_sign_in_ip        :string
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  name                   :string
#  nickname               :string
#  image                  :string
#  email                  :string
#  tokens                 :text
#  role_ids               :string           default([])
#  password_expired_at    :datetime
#  created_at             :datetime
#  updated_at             :datetime
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_uid_and_provider      (uid,provider) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#

FactoryGirl.define do
  email = Faker::Internet.email
  password = Faker::Internet.password

  factory :user do
    transient do
      permission false
    end

    name { Faker::Name.name }
    email email
    uid email
    provider 'email'
    password password
    password_confirmation password

    before(:create) do |user, evaluator|
      if evaluator.permission
        Permission.create name: evaluator.permission
        role = Role.create(name: "Role: #{evaluator.permission}", permissions: [evaluator.permission])
        user.role_ids = [role.id]
      end
    end
  end

end
