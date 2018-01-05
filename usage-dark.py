'''
usage.py
'''

import os
from radar_graph import RadarComponent
import flask
import dash
import dash_html_components as html
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize

app = dash.Dash('')
app.scripts.config.serve_locally = True

mockDriverData = [
    [
        {
            'axis': 'Lewis Hamilton',
            'value': 20,
        },
        {
            'axis': 'Sebastian Vettel',
            'value': 42,
        },
        {
            'axis': 'Valtteri Bottas',
            'value': 39,
        },
        {
            'axis': 'Fernando Alonso',
            'value': 61,
        },
        {
            'axis': 'Stoffel Vandoorne',
            'value': 13,
        },
    ],
    [
        {
            'axis': 'Lewis Hamilton',
            'value': 3,
        },
        {
            'axis': 'Sebastian Vettel',
            'value': 86,
        },
        {
            'axis': 'Valtteri Bottas',
            'value': 23,
        },
        {
            'axis': 'Fernando Alonso',
            'value': 46,
        },
        {
            'axis': 'Stoffel Vandoorne',
            'value': 61,
        },
    ],
    [
        {
            'axis': 'Lewis Hamilton',
            'value': 73,
        },
        {
            'axis': 'Sebastian Vettel',
            'value': 19,
        },
        {
            'axis': 'Valtteri Bottas',
            'value': 3,
        },
        {
            'axis': 'Fernando Alonso',
            'value': 6,
        },
        {
            'axis': 'Stoffel Vandoorne',
            'value': 42,
        },
    ],
]

mockLegendData = [
    'Driver 1',
    'Driver 2',
    'Driver 3'
]

cmap = plt.cm.plasma
norm = Normalize(vmin=0, vmax=3)
colours = cmap(norm([0, 1, 2]))

app.layout = html.Div([
    html.H1(
        ['Radar Graph Example - Dark']
    ),
    RadarComponent(
        id='radar-graph',
        className='dark',
        config={
            'data': mockDriverData,
            'legend': mockLegendData,
            'radius': 2,
            'title': '% Driver Similarity',
            'extraWidthX': 150,
            'axisStrokeColor': 'grey',
            'color': colours,
        }
    ),
], className="container")


@app.server.route('/demo/<path:path>')
def static_file(path):
    '''
    Serve up local static files using flask
    '''
    static_folder = os.path.join(os.getcwd(), 'demo')
    return flask.send_from_directory(static_folder, path)


app.css.append_css({"external_url": "/demo/style-dark.css"})


if __name__ == '__main__':
    app.run_server(debug=True)
