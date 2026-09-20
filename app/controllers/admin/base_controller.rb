class Admin::BaseController < ApplicationController
  before_action :require_authentication
  before_action :require_admin

  layout "admin"

  private
    def require_admin
      redirect_to login_path, alert: "Admin access only." unless current_user&.admin?
    end
end
