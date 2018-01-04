'''
usage.py
'''

import os
from radar_graph import RadarComponent
import flask
import dash
import dash_html_components as html

app = dash.Dash('')

app.scripts.config.serve_locally = True



app.layout = html.Div([
    html.H1(
        ['Radar Graph Example']
    ),
    RadarComponent(
        id='radar-graph',
    ),
], className="container")



@app.server.route('/demo/<path:path>')
def static_file(path):
    '''
    Serve up local static files using flask
    '''
    static_folder = os.path.join(os.getcwd(), 'demo')
    return flask.send_from_directory(static_folder, path)

app.css.append_css({"external_url": "/demo/style.css"})


if __name__ == '__main__':
    app.run_server(debug=True)
