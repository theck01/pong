from flask import Flask, render_template, url_for
app = Flask(__name__)
app.config.from_object('config')

def condense_scripts():
  return app.config['EXTERNAL_SCRIPTS'] + map(lambda s: url_for('static', filename=s), app.config['INTERNAL_SCRIPTS'])

def condense_styles():
  return app.config['EXTERNAL_STYLES'] + map(lambda s: url_for('static', filename=s), app.config['INTERNAL_STYLES'])
    
@app.route('/')
def main_menu():
  return render_template("main_page.html", javascripts=condense_scripts(), stylesheets=condense_styles(), num_players=0, menu="main_menu.html")

@app.route('/single')
def single_player():
  return render_template("main_page.html", javascripts=condense_scripts(), stylesheets=condense_styles(), num_players=1, menu=None)

@app.route('/multi')
def multi_player():
  return render_template("main_page.html", javascripts=condense_scripts(), stylesheets=condense_styles(), num_players=2, menu=None)

@app.route('/howto')
def howto():
  return render_template("main_page.html", javascripts=condense_scripts(), stylesheets=condense_styles(), num_players=0, menu="howto.html")

if __name__ == '__main__':
  app.debug = True
  app.run()
