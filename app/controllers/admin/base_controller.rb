class Admin::BaseController < ApplicationController
  include Authentication

  before_action :require_admin

  layout "admin"

  private
    def require_admin
      redirect_to new_session_path, alert: "Admin access only." unless current_user&.admin?
    end
end
