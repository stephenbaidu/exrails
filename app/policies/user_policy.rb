class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if @user.admin?
        scope.where('id > 1')
      else
        user_ids = scope.select do |u|
          u.branch && (u.branch[:id] == @user.branch.id)
        end.map(&:id)
        User.where(id: user_ids)
      end
    end
  end

  def index?
    has_permission?("#{record.class.name}:index")
  end

  def create?
    has_permission?("#{record.class.name}:create")
  end

  def show?
    user.id == record.id or has_permission?("#{record.class.name}:show")
  end

  def update?
    user.id == record.id or has_permission?("#{record.class.name}:update")
  end

  def destroy?
    false
  end
end
