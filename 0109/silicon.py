import mlx.core as mx
import time

def fun(a, b, d1, d2):
    print(f'd1={d1} d2={d2}')
    start_time = time.time()
    x = mx.matmul(a,b,stream=d1)
    # for _ in range(50000):
    #     b = mx.exp(b, stream=d2)
    execution_time = 1000*(time.time()-start_time)
    print(f'› Took {execution_time} seconds')
    return x, b

a = mx.random.uniform(shape=(4096*20, 512))
b = mx.random.uniform(shape=(512, 4))

fun(a, b, d1=mx.gpu, d2=mx.gpu)
fun(a, b, d1=mx.gpu, d2=mx.cpu)
fun(a, b, d1=mx.cpu, d2=mx.cpu)
