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

class User < ActiveRecord::Base
  resourcify
  
  serialize :role_ids, Array
  
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :confirmable, :omniauthable, :lockable
  include DeviseTokenAuth::Concerns::User

  validates :name, presence: true

  def admin?
    has_role? 'Admin'
  end

  def manager?
    has_role? 'Manager'
  end

  def clerk?
    has_role? 'Clerk'
  end

  def has_role?(role_name)
    roles.map(&:name).include?(role_name)
  end

  def roles
    Role.unscoped.where id: self.role_ids
  end

  def permissions
    if self.admin?
      Permission.pluck(:name)
    else
      self.roles.map(&:permissions).flatten
    end
  end

  def has_permission?(permission)
    if Permission.where(name: permission).exists?
      self.roles.map(&:permissions).flatten.include? permission
    else
      false
    end
  end

  def token_validation_response
    UserTokenValidationSerializer.new(self, root: false)
  end
end
