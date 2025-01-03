import argparse

from labelui.api.api import start


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', default='127.0.0.1')
	parser.add_argument('--port', type=int, default=8001)
	args = parser.parse_args()
	start(args.host, args.port)

if __name__ == '__main__':
	main()