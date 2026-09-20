class BasecampCallbacksController < ApplicationController
  allow_unauthenticated_access
  skip_before_action :verify_authenticity_token

  def create
    code = params[:code].presence || params[:access_token].presence || params[:token].presence
    token = params[:access_token].presence || params[:token].presence

    # If we got a code, try to exchange it for a token if client_secret is available
    # Otherwise just store whatever we got
    value_to_store = token.presence || code
    if value_to_store.blank?
      render json: { error: "No code or token provided", params: params.to_unsafe_h }, status: :bad_request
      return
    end

    # Write to .env
    env_path = Rails.root.join(".env")
    if File.exist?(env_path)
      content = File.read(env_path)
      # Replace BASECAMP_ACCESS_TOKEN line, or append if missing
      if content.match?(/^BASECAMP_ACCESS_TOKEN=.*$/)
        content.gsub!(/^BASECAMP_ACCESS_TOKEN=.*$/, "BASECAMP_ACCESS_TOKEN=#{value_to_store}")
      else
        content += "\nBASECAMP_ACCESS_TOKEN=#{value_to_store}\n"
      end
      File.write(env_path, content)
    else
      File.write(env_path, "BASECAMP_ACCESS_TOKEN=#{value_to_store}\n")
    end

    # Also write to a capture file for verification
    File.write(Rails.root.join("tmp/basecamp_token_captured.txt"), value_to_store)

    render json: { ok: true, stored: value_to_store[0..12] + "...", env_path: env_path.to_s }
  end

  def show
    # also support GET for manual capture
    create
  end
end
