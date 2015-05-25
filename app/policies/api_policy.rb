class ApiPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope
    end
  end

  def index?
    has_permission?("#{@record.class.name}:index")
  end

  def create?
    has_permission?("#{@record.class.name}:create")
  end

  def show?
    has_permission?("#{@record.class.name}:show")
  end

  def update?
    has_permission?("#{@record.class.name}:update")
  end

  def destroy?
    has_permission?("#{@record.class.name}:delete")
  end
end
