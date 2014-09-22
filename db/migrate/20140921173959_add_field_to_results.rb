class AddFieldToResults < ActiveRecord::Migration
  def change
    add_column :results, :spotify_id, :string
  end
end
