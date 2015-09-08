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

class UserTokenValidationSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :nickname, :provider, :role_ids, :uid, :status
  attributes :sign_in_count, :current_sign_in_ip, :last_sign_in_ip, :current_sign_in_at, :last_sign_in_at, :failed_attempts
  attributes :permissions, :has_admin_role, :has_manager_role, :has_clerk_role

  def status
    object.locked_at ? 'Locked' : 'Active'
  end

  def client
    object.client.slice(:id, :name)
  end

  def has_admin_role() object.admin? end

  def has_manager_role() object.manager? end

  def has_clerk_role() object.clerk? end
end
