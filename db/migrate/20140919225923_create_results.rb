class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.string :artist
      t.references :search_history, index: true

      t.timestamps
    end

  end
end
