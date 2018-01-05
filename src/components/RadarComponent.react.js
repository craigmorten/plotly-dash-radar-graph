import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import d3 from 'd3';

const RadarChart = {
    draw: (_id, _legend, _d, _options) => {
        console.log('RadarChart.draw', _id, _legend, _d, _options);

        // Set the defaults
        let defaultConfig = {
            defaultColor: 'grey',
            defaultFontFamily: 'sans-serif',
            defaultFontSize: '12px',

            title: '',

            radius: 5,
            
            width: 500,
            height: 500,

            factor: 1,
            factorLegend: 0.85,

            maxValue: 1,

            radians: 2 * Math.PI,

            toRight: 5,

            translateX: 100,
            translateY: 90,

            extraWidthX: 100,
            extraWidthY: 100,

            color: d3.scale.category10(),

            titleX: 0,
            titleY: 50,
            titleFontSize: '18px',
            titleFontFamily: '',
            titleColor: '',

            legendRight: '150',
            legendTop: '40',
            legendFontSize: '',
            legendFontFamily: '',
            legendColor: '',
            legendSquareSize: 10,

            levels: 10,
            levelsStrokeColor: 'grey',
            levelsStrokeOpacity: '0.7',
            levelsStrokeWidth: '1',

            axisTickFontFamily: '',
            axisTickFontSize: '',
            axisTickColor: '',

            axisLabelFontFamily: '',
            axisLabelFontSize: '',
            axisLabelColor: '',
            axisLabelTextAnchor: 'middle',

            axisStrokeColor: '#000000',
            axisStrokeWidth: '1',

            tooltipFontFamily: '',
            tooltipFontSize: '',
            tooltipColor: '',

            areaBorderWidth: '2px',

            areaOpacity: '0.5',
            areaOpacityAreaHover: '0.7',
            areaOtherOpacityAreaHover: '0.1',
            areaOpacityNodeHover: '0.7',
            areaOtherOpacityNodeHover: '0.1',

            nodeOpacity: '0.7'
        };

        if (!_d || _d.length === 0 || _d[0].length === 0) {
            return;
        }

        if (!_legend) {
            _legend = [];
        }

        // Set overrides
        if ('undefined' !== typeof _options) {
            for (let i in _options) {
                if ('undefined' !== typeof _options[i]) {
                    defaultConfig[i] = _options[i];
                }
            }
        }

        defaultConfig.maxValue = Math.max(defaultConfig.maxValue, d3.max(_d, (i) => {
            return d3.max(i.map((o) => {
                return o.value;
            }));
        }));

        // Make assumption that d[0].length === d[n].length for all n between 0 and (d.length - 1).
        let allAxis = (_d[0].map((i) => {
            return i.axis;
        }));

        let total = allAxis.length;
        let radius = defaultConfig.factor * Math.min(defaultConfig.width / 2, defaultConfig.height / 2);
        let Format = d3.format('%');

        // Cleanup
        d3.select(_id)
            .select('svg')
            .remove();

        // Create the svg container and the base g tag
        let g = d3.select(_id)
            .append('svg')
            .attr('width', defaultConfig.width + defaultConfig.extraWidthX)
            .attr('height', defaultConfig.height + defaultConfig.extraWidthY)
            .append('g')
            .attr('transform', 'translate(' + defaultConfig.translateX + ',' + defaultConfig.translateY + ')');

        // Tooltip
        let tooltip = g.append('text')
            .style('opacity', 0)
            .attr('fill', defaultConfig.tooltipColor || defaultConfig.defaultColor)
            .style('font-family', defaultConfig.tooltipFontFamily || defaultConfig.defaultFontFamily)
            .style('font-size', defaultConfig.tooltipFontSize || defaultConfig.defaultFontSize);

        // Circular segments
        for (let j = 0; j < defaultConfig.levels - 1; j++) {
            const levelFactor = defaultConfig.factor * radius * ((j + 1) / defaultConfig.levels);

            g.selectAll('.levels')
                .data(allAxis)
                .enter()
                .append('svg:line')
                .attr('x1', (d, i) => {
                    return levelFactor * (1 - defaultConfig.factor * Math.sin(i * defaultConfig.radians / total));
                })
                .attr('y1', (d, i) => {
                    return levelFactor * (1 - defaultConfig.factor * Math.cos(i * defaultConfig.radians / total));
                })
                .attr('x2', (d, i) => {
                    return levelFactor * (1 - defaultConfig.factor * Math.sin((i + 1) * defaultConfig.radians / total));
                })
                .attr('y2', (d, i) => {
                    return levelFactor * (1 - defaultConfig.factor * Math.cos((i + 1) * defaultConfig.radians / total));
                })
                .attr('class', 'line')
                .style('stroke', defaultConfig.levelsStrokeColor)
                .style('stroke-opacity', defaultConfig.levelsStrokeOpacity)
                .style('stroke-width', defaultConfig.levelsStrokeWidth)
                .attr('transform', 'translate(' + (defaultConfig.width / 2 - levelFactor) + ', ' + (defaultConfig.height / 2 - levelFactor) + ')');
        }

        // Text indicating at what % each level is
        for (let j = 0; j < defaultConfig.levels; j++) {
            let levelFactor = defaultConfig.factor * radius * ((j + 1) / defaultConfig.levels);

            g.selectAll('.levels')
                .data([1]) // dummy data
                .enter()
                .append('svg:text')
                .attr('x', levelFactor * (1 - defaultConfig.factor * Math.sin(0)))
                .attr('y', levelFactor * (1 - defaultConfig.factor * Math.cos(0)))
                .attr('class', 'legend')
                .style('font-family', defaultConfig.axisTickFontFamily || defaultConfig.defaultFontFamily)
                .style('font-size', defaultConfig.axisTickFontSize || defaultConfig.defaultFontSize)
                .attr('transform', 'translate(' + (defaultConfig.width / 2 - levelFactor + defaultConfig.toRight) + ', ' + (defaultConfig.height / 2 - levelFactor) + ')')
                .attr('fill', defaultConfig.axisTickColor || defaultConfig.defaultColor)
                .text(Format((j + 1) * defaultConfig.maxValue / defaultConfig.levels));
        }

        let series = 0;

        let axis = g.selectAll('.axis')
            .data(allAxis)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axis.append('line')
            .attr('x1', defaultConfig.width / 2)
            .attr('y1', defaultConfig.height / 2)
            .attr('x2', (d, i) => {
                return defaultConfig.width / 2 * (1 - defaultConfig.factor * Math.sin(i * defaultConfig.radians / total));
            })
            .attr('y2', (d, i) => {
                return defaultConfig.height / 2 * (1 - defaultConfig.factor * Math.cos(i * defaultConfig.radians / total));
            })
            .attr('class', 'line')
            .style('stroke', defaultConfig.axisStrokeColor)
            .style('stroke-width', defaultConfig.axisStrokeWidth);

        axis.append('text')
            .attr('class', 'legend')
            .text((d) => {
                return d;
            })
            .attr('fill', defaultConfig.axisLabelColor || defaultConfig.defaultColor)
            .style('font-family', defaultConfig.axisLabelFontFamily || defaultConfig.defaultFontFamily)
            .style('font-size', defaultConfig.axisLabelFontSize || defaultConfig.defaultFontSize)
            .attr('text-anchor', defaultConfig.axisLabelTextAnchor)
            .attr('dy', '1.5em')
            .attr('transform', () => {
                return 'translate(0, -10)';
            })
            .attr('x', (d, i) => {
                return defaultConfig.width / 2 * (1 - defaultConfig.factorLegend * Math.sin(i * defaultConfig.radians / total)) - 60 * Math.sin(i * defaultConfig.radians / total);
            })
            .attr('y', (d, i) => {
                return defaultConfig.height / 2 * (1 - Math.cos(i * defaultConfig.radians / total)) - 20 * Math.cos(i * defaultConfig.radians / total);
            });

        _d.forEach((y) => {
            g.selectAll('.nodes')
                .data(y)
                .enter()
                .append('svg:circle')
                .attr('class', 'radar-chart-serie' + series)
                .attr('r', defaultConfig.radius)
                .attr('alt', (j) => {
                    return Math.max(j.value, 0);
                })
                .attr('cx', (j, i) => {
                    return defaultConfig.width / 2 * (1 - (Math.max(j.value, 0) / defaultConfig.maxValue) * defaultConfig.factor * Math.sin(i * defaultConfig.radians / total));
                })
                .attr('cy', (j, i) => {
                    return defaultConfig.height / 2 * (1 - (Math.max(j.value, 0) / defaultConfig.maxValue) * defaultConfig.factor * Math.cos(i * defaultConfig.radians / total));
                })
                .attr('data-id', (j) => {
                    return j.axis;
                })
                .style('fill', defaultConfig.color(series)).style('fill-opacity', defaultConfig.nodeOpacity)
                .on('mouseover', function (d) {
                    let newX = parseFloat(d3.select(this).attr('cx')) - 10;
                    let newY = parseFloat(d3.select(this).attr('cy')) - 5;

                    tooltip.attr('x', newX)
                        .attr('y', newY)
                        .text(Format(d.value))
                        .transition(300)
                        .style('opacity', 1);

                    let z = 'polygon.' + d3.select(this).attr('class');

                    g.selectAll('polygon')
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOtherOpacityNodeHover);

                    g.selectAll(z)
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOpacityNodeHover);
                })
                .on('mouseout', () => {
                    tooltip.transition(300)
                        .style('opacity', 0);
    
                    g.selectAll('polygon')
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOpacity);
                })
                .append('svg:title')
                .text((j) => {
                    return Math.max(j.value, 0);
                });

            let dataValuesArea = [];

            g.selectAll('.nodes')
                .data(y, (j, i) => {
                    dataValuesArea.push([
                        defaultConfig.width / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / defaultConfig.maxValue) * defaultConfig.factor * Math.sin(i * defaultConfig.radians / total)),
                        defaultConfig.height / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / defaultConfig.maxValue) * defaultConfig.factor * Math.cos(i * defaultConfig.radians / total))
                    ]);
                });

                dataValuesArea.push(dataValuesArea[0]);

            g.selectAll('.area')
                .data([dataValuesArea])
                .enter()
                .append('polygon')
                .attr('class', 'radar-chart-serie-' + series)
                .style('stroke-width', defaultConfig.areaBorderWidth)
                .style('stroke', defaultConfig.color(series))
                .attr('points', (d) => {
                    let str = '';
                    for (let pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + ',' + d[pti][1] + ' ';
                    }
                    return str;
                })
                .style('fill', () => {
                    return defaultConfig.color(series);
                })
                .style('fill-opacity', defaultConfig.areaOpacity)
                .on('mouseover', function () {
                    let z = 'polygon.' + d3.select(this).attr('class');
                    g.selectAll('polygon')
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOtherOpacityAreaHover);
                    g.selectAll(z)
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOpacityAreaHover);
                })
                .on('mouseout', () => {
                    g.selectAll('polygon')
                        .transition(300)
                        .style('fill-opacity', defaultConfig.areaOpacity);
                });
            series++;
        });

        const svg = d3.select(_id)
            .selectAll('svg')
            .append('svg')
            .attr('width', defaultConfig.width + defaultConfig.extraWidthX)
            .attr('height', defaultConfig.height + defaultConfig.extraWidthY);

        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(90,0)')
            .attr('x', defaultConfig.titleX)
            .attr('y', defaultConfig.titleY)
            .attr('font-size', defaultConfig.titleFontSize || defaultConfig.defaultFontSize)
            .attr('font-family', defaultConfig.titleFontFamily || defaultConfig.defaultFontFamily)
            .attr('fill', defaultConfig.titleColor || defaultConfig.defaultColor)
            .text(defaultConfig.title);

        const legend = svg.append('g')
            .attr('class', '__legend')
            .attr('height', 100)
            .attr('width', 200)
            .attr('transform', `translate(0, ${defaultConfig.legendTop})`);

        legend.selectAll('rect')
            .data(_legend)
            .enter()
            .append('rect')
            .attr('x', defaultConfig.width + defaultConfig.extraWidthX - defaultConfig.legendRight)
            .attr('y', (d, i) => {
                return i * 20;
            })
            .attr('width', defaultConfig.legendSquareSize)
            .attr('height', defaultConfig.legendSquareSize)
            .style('fill', (d, i) => {
                return defaultConfig.color(i);
            });

        legend.selectAll('text')
            .data(_legend)
            .enter()
            .append('text')
            .attr('x', defaultConfig.width + defaultConfig.extraWidthX - defaultConfig.legendRight + 20)
            .attr('y', (d, i) => {
                return i * 20 + 9;
            })
            .attr('font-size', defaultConfig.legendFontSize || defaultConfig.defaultFontSize)
            .attr('font-family', defaultConfig.legendFontFamily || defaultConfig.defaultFontFamily)
            .attr('fill', defaultConfig.legendColor || defaultConfig.defaultColor)
            .text((d) => {
                return d;
            });
    }
};

/**
 * RadarGraph is an radar graph component.
 */
export default class RadarGraph extends Component {
    plot(props) {
        console.log('plot', this.props);

        const {id, config} = props;

        if (!config || !config.data || config.data.length === 0 || config.data[0].length === 0) {
            return;
        }

        if (config.maxValue) {
            config.maxValue /= 100;
        }

        if (config.color) {
            console.log(d3.scale.category10());
            console.log(config.color);
            
            const colours = config.color.map((v) => {
                return `rgba(${v[0]*255}, ${v[1]*255}, ${v[2]*255}, ${v[3]})`;
            });

            config.color = function(i) {
                return colours[i];
            };
        }

        const parsedData = config.data.map((v) => {
            return v.map((_v) => {
                _v.value /= 100;
                return _v;
            });
        });

        RadarChart.draw(`#${id}`, config.legend, parsedData, config);
    }

    componentDidMount() {
        console.log('componentDidMount', this.props);
        this.plot(this.props);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount', this.props);
        if (this.eventEmitter) {
            this.eventEmitter.removeAllListeners();
        }
    }

    shouldComponentUpdate(nextProps) {
        console.log('shouldComponentUpdate', this.props);
        return (
            (this.props.id !== nextProps.id) || (JSON.stringify(this.props.style) !== JSON.stringify(nextProps.style))
        );
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', this.props);
        const idChanged = (this.props.id !== nextProps.id);
        if (idChanged) {
            /*
             * then the dom needs to get re-rendered with a new ID.
             * the graph will get updated in componentDidUpdate
             */
            return;
        }

        const configChanged = this.props.config !== nextProps.config;
        if (configChanged) {
            this.plot(nextProps);
        }
    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate', this.props);
        if (prevProps.id !== this.props.id) {
            this.plot(this.props);
        }
    }

    render() {
        console.log('render', this.props);
        const {id, style, className} = this.props;

        return (
            <div
                key={id}
                id={id}
                style={style}
                className={className}
            />
        );
    }
}

RadarGraph.propTypes = {
    /**
     * The ID used to identify this graph in Dash callbacks.
     */
    id: PropTypes.string.isRequired,

    /**
     * Generic style overrides on the plot div.
     */
    style: PropTypes.any,

    /**
     * className of the parent div.
     */
    className: PropTypes.string,

    /**
     * Graph configuration options.
     */
    config: PropTypes.shape({
        /**
         * A title that will be printed when this graph is rendered.
         */
        title: PropTypes.string,

        /**
         * The radar chart title's x position from the left
         */
        titleX: PropTypes.number,

        /**
         * The radar chart title's y position from the top
         */
        titleY: PropTypes.number,

        /**
         * The radar chart title's text font size
         */
        titleFontSize: PropTypes.string,

        /**
         * The radar chart title's text font family
         */
        titleFontFamily: PropTypes.string,

        /**
         * The radar chart title's text color
         */
        titleColor: PropTypes.string,

        /**
         * The radius of the nodes.
         */
        radius: PropTypes.number,

        /**
         * The width of the plot.
         */
        width: PropTypes.number,

        /**
         * The height of the plot.
         */
        height: PropTypes.number,

        /**
         * The factor
         */
        factor: PropTypes.number,

        /**
         * The factor legend
         */
        factorLegend: PropTypes.number,

        /**
         * The max % value on the radar graph axis e.g. 100 for 100%.
         */
        maxValue: PropTypes.number,

        /**
         * The radians
         */
        radians: PropTypes.number,

        /**
         * The to rightness
         */
        toRight: PropTypes.number,

        /**
         * The x translation
         */
        translateX: PropTypes.number,

        /**
         * The y translation
         */
        translateY: PropTypes.number,

        /**
         * The extra x width
         */
        extraWidthX: PropTypes.number,

        /**
         * The extra y width
         */
        extraWidthY: PropTypes.number,

        /**
         * The color array for the area plots
         */
        color: PropTypes.any,

        /**
         * The number of ticks on the radar graph axis.
         */
        levels: PropTypes.number,

        /**
         * The radar chart data
         */
        data: PropTypes.arrayOf(
            PropTypes.arrayOf(
                PropTypes.shape({
                    axis: PropTypes.string.isRequired,
                    value: PropTypes.number.isRequired
                })
            )
        ).isRequired,

        /**
         * The radar chart legend entries
         */
        legend: PropTypes.array,

        /**
         * The radar chart legend x position from the right of the plot
         */
        legendRight: PropTypes.number,

        /**
         * The radar chart legend y position from the top of the plot
         */
        legendTop: PropTypes.number,

        /**
         * The radar chart legend text font size
         */
        legendFontSize: PropTypes.string,

        /**
         * The radar chart legend text font family
         */
        legendFontFamily: PropTypes.string,

        /**
         * The radar chart legend text colour
         */
        legendColor: PropTypes.string,

        /**
         * The radar chart legend coloured squares size
         */
        legendSquareSize: PropTypes.number,

        /**
         * The radar chart levels stroke color
         */
        levelsStrokeColor: PropTypes.string,

        /**
         * The radar chart levels stroke opacity
         */
        levelsStrokeOpacity: PropTypes.number,

        /**
         * The radar chart levels stroke width
         */
        levelsStrokeWidth: PropTypes.number,

        /**
         * The radar chart axis text font family
         */
        axisTickFontFamily: PropTypes.string,

        /**
         * The radar chart axis text font size
         */
        axisTickFontSize: PropTypes.string,

        /**
         * The radar chart axis text colour
         */
        axisTickColor: PropTypes.string,

        /**
         * The radar chart axis label text font family
         */
        axisLabelFontFamily: PropTypes.string,

        /**
         * The radar chart axis label text font size
         */
        axisLabelFontSize: PropTypes.string,

        /**
         * The radar chart axis label text font colour
         */
        axisLabelColor: PropTypes.string,

        /**
         * The radar chart axis label text anchor position
         */
        axisLabelTextAnchor: PropTypes.string,

        /**
         * The radar chart axis stroke colour
         */
        axisStrokeColor: PropTypes.string,

        /**
         * The radar chart axis stroke width
         */
        axisStrokeWidth: PropTypes.numnber,

        /**
         * The radar chart tooltip text font family
         */
        tooltipFontFamily: PropTypes.string,

        /**
         * The radar chart tooltip text font size
         */
        tooltipFontSize: PropTypes.string,

        /**
         * The radar chart tooltip text colour
         */
        tooltipColor: PropTypes.string,

        /**
         * The radar chart areas' border widths
         */
        areaBorderWidth: PropTypes.string,

        /**
         * The radar chart areas' default opacity
         */
        areaOpacity: PropTypes.number,

        /**
         * A radar chart area's opacity when being hovered over
         */
        areaOpacityAreaHover: PropTypes.number,

        /**
         * The radar chart other areas' opacity when another area is being hovered over
         */
        areaOtherOpacityAreaHover: PropTypes.number,

        /**
         * A radar chart area's opacity when one of it's nodes is being hovered over
         */
        areaOpacityNodeHover: PropTypes.number,

        /**
         * The radar chart other areas' opacity when another a node from a different area is being hovered over
         */
        areaOtherOpacityNodeHover: PropTypes.number,

        /**
         * The radar chart nodes' default opacity
         */
        nodeOpacity: PropTypes.number
    }),

    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change.
     */
    setProps: PropTypes.func
};

RadarGraph.defaultProps = {
    config: {
        title: 'Demo Radar Graph',
        data: [
            [
                {
                    axis: 'Demo Axis 1', 
                    value: 10
                },
                {
                    axis: 'Demo Axis 2', 
                    value: 20
                },
                {
                    axis: 'Demo Axis 3', 
                    value: 40
                },
                {
                    axis: 'Demo Axis 4', 
                    value: 60
                },
                {
                    axis: 'Demo Axis 5', 
                    value: 90
                }
            ],
            [
                {
                    axis: 'Demo Axis 1', 
                    value: 80
                },
                {
                    axis: 'Demo Axis 2', 
                    value: 70
                },
                {
                    axis: 'Demo Axis 3', 
                    value: 60
                },
                {
                    axis: 'Demo Axis 4', 
                    value: 50
                },
                {
                    axis: 'Demo Axis 5', 
                    value: 40
                }
            ]
        ],
        legend: [
            'Demo Legend 1',
            'Demo Legend 2'
        ]
    }
};