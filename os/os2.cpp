//��дһ������ʵ�����´��̵����㷨��FCFS��SSTF��SCAN��C - SCAN��LOOK��C - LOOK��
//��������������5000����Ĵ��̣������0 - 4999��
//�ó�������һ������Ϊ1000�������������У�
//����Ϊ��ͷ�ĳ�ʼλ�ã����Ϊÿ���㷨�Ĵ�ͷ�ƶ����ܵ�����
#include<iostream>
#include<vector>
#include<time.h>
#include<algorithm>
using namespace std;

int FCFS(vector<int> requset, int start) 
{
	int len = requset.size();
	int count = requset[0] - start;
	for (int i = 1; i < len; i++) {
		count += abs(requset[i] - requset[i - 1]);
	}
	return count;
}

int SSTF(vector<int> request, int start)
{
	int len = request.size();
	vector<bool> visit(len,false);
	int current = start;
	int count = 0;
	//�ܹ�Ҫ����len��ҳ��
	for (int i = 0; i < len; i++) {
		//�������ʵĵ�i��ҳ�����ĸ�
		int temp = 5001, it = 5000;
		for (int j = 0; j < len; j++) {
			int dis = abs(request[j] - current);
			if (dis < temp && visit[j] == false) {
				temp = dis;
				it = j;
			}
		}
		count += temp;
		visit[it] = true;
		current = request[it];
	}
	return count;
}

int SCAN(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//���������ƶ�
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += 4999 - request[len - 1];
		count += 4999 - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
	}

	//��С�������ƶ�
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[0] - 0;
		count += request[index] - 0;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int LOOK(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//���������ƶ�
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
	}

	//��С�������ƶ�
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[index] - request[0];
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int C_SCAN(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//���������ƶ�
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += 4999 - request[len - 1];
		count += 4999 - 0;
		count += request[0] - 0;
		for (int i = 1; i < index; i++) {
			count += request[i] - request[i - 1];
		}
	}

	//��С�������ƶ�
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[0] - 0;
		count += 4999 - 0;
		count += 4999 - request[len - 1];
		for (int i = len - 1; i > index; i--) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int C_LOOK(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//���������ƶ�
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[0];
		for (int i = 1; i < index; i++) {
			count += request[i] - request[i - 1];
		}
	}

	//��С�������ƶ�
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[0];
		for (int i = len - 1; i > index; i--) {
			count += request[i] - request[i - 1];
		}
	}
	return count;
}

int main()
{
	srand(time(NULL));
	vector<int> request(1000);
	for (int i = 0; i < 1000; i++) {
		request[i] = rand() % 5000;
	}
	int start,direction;
	cout<< "�������ͷ��ʼλ��(0 - 4999):";
	cin >> start;
	cout << endl;
	cout << "�������ͷ��ʼ�ƶ�����0Ϊ����������1Ϊ��С������:";
	cin >> direction;
	cout << endl;

	for (int i = 0; i < 1000; i++) {
		cout << request[i] << endl;
	}

	int count = FCFS(request, start);
	cout << "FCFS�㷨�ƶ���ͷ��������Ϊ" << count << endl;

	count = SSTF(request, start);
	cout << "SSTF�㷨�ƶ���ͷ��������Ϊ" << count << endl;

	count = SCAN(request, start,direction);
	cout << "SCAN�㷨�ƶ���ͷ��������Ϊ" << count << endl;

	count = C_SCAN(request, start, direction);
	cout << "C-SCAN�㷨�ƶ���ͷ��������Ϊ" << count << endl;

	count = LOOK(request, start, direction);
	cout << "LOOK�㷨�ƶ���ͷ��������Ϊ" << count << endl;

	count = C_LOOK(request, start, direction);
	cout << "C-LOOK�㷨�ƶ���ͷ��������Ϊ" << count << endl;
}