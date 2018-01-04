from setuptools import setup

exec (open('radar_graph/version.py').read())

setup(
    name='radar_graph',
    version=__version__,
    author='craigmorten',
    packages=['radar_graph'],
    include_package_data=True,
    license='MIT',
    description='A radar graph',
    install_requires=[]
)
